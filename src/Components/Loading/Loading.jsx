export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-zinc-700 dark:border-t-purple-400 border-t-purple-600 animate-spin" />
        <p className="text-sm text-gray-400 dark:text-zinc-500">Loading...</p>
      </div>
    </div>
  );
}
