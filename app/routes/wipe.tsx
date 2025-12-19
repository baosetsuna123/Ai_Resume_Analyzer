import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Wipe App</h1>
            <p className="mb-4">Authenticated as: {auth.user?.username}</p>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Existing Files:</h2>
                {files.length > 0 ? (
                    <div className="flex flex-col gap-4 mt-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex flex-row items-center gap-4 p-4 border rounded-md shadow-sm"
                            >
                                <img
                                    src="/images/pdf.png"
                                    alt="pdf icon"
                                    className="w-10 h-10"
                                />
                                <div className="flex-1">
                                    <p className="text-lg font-medium">{file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Path: {file.path}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-500 mt-4">No resumes found.</p>
                )}
            </div>
            {files.length > 0 && (
                <div className="flex justify-center mt-6">
                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-md cursor-pointer flex items-center gap-2"
                        onClick={handleDelete}
                    >
                        <img
                            src="/icons/trash.svg"
                            alt="trash icon"
                            className="w-5 h-5"
                        />
                        Wipe App Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default WipeApp;