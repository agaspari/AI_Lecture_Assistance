import React, { useRef } from 'react';
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        const form = new FormData();
        // append each file under the same field name
        Array.from(fileList).forEach(file => {
            form.append('file', file);
        });

        const res = await axios.post('/api/upload', form);

        // instead of replacing, merge new uploads into the existing array:
        onUpload(res.data.files);

        // clear the input so re-selecting the same files will still fire
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemove = async (filepath: string) => {
        // first delete on the server
        await axios.post('/api/remove', { filepath });
        // then update parent state
        onRemoveFile(filepath);
    };

    return (
        <div className="p-4 border-r space-y-4">
            <h2 className="font-bold">Input Documents</h2>

            {/* Styled button proxy for the hidden input */}
            <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
            >
                Upload Document
            </label>
            <input
                id="file-upload"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
            />

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
    );
}