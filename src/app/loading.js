export default function Loading() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div
                className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00ffee]"
                role="status"
                aria-label="Loading"
            />
        </main>
    );
}
