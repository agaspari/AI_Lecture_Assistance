import React, { useRef, useState, DragEvent } from 'react';
import axios from 'axios';

interface FileInfo {
    filepath: string;
    originalFilename: string;
}

export function FilePanel({
    files,
    onUpload,
    onRemoveFile,
}: {
    files: FileInfo[];
    onUpload: (files: FileInfo[]) => void;
    onRemoveFile: (filepath: string) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const uploadFiles = async (fileList: FileList) => {
        if (fileList.length === 0) return;
        const form = new FormData();
        Array.from(fileList).forEach((file) => form.append('file', file));
        const res = await axios.post('/api/upload', form);
        onUpload(res.data.files);
    };

    // Handle files dropped into the zone
    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await uploadFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    // Handle file selection via input
    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        await uploadFiles(e.target.files);
        // reset so same file can be selected again
        e.target.value = '';
    };


    // Keep the drop zone styled when dragging
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleRemove = async (filepath: string) => {
        // first delete on the server
        await axios.post('/api/remove', { filepath });
        // then update parent state
        onRemoveFile(filepath);
    };

    return (
        <div className="p-4 border-r space-y-4">
            <div className="p-4 border-r space-y-4 flex-shrink-0 w-64">
                <h2 className="font-bold">Input Documents</h2>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        relative
                        flex items-center justify-center
                        w-full            /* fill the parent’s width */
                        h-32
                        p-6 border-2 border-dashed rounded text-center
                        ${isDragging
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 bg-white'}
                        `}
                >
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                        {isDragging ? (
                            <p>Drop files here to upload!</p>
                        ) : (
                            <p>Drag &amp; drop files here, or click to browse</p>
                        )}
                    </div>
                </div>

                {/* File list with individual remove buttons */}
                <div className="mt-4 space-y-2">
                    {files.map((f) => (
                        <div
                            key={f.filepath}
                            className="flex justify-between items-center"
                        >
                            <span className="truncate">{f.originalFilename}</span>
                            <button
                                onClick={() => handleRemove(f.filepath)}
                                className="text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}