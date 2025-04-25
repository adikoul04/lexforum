export default function Layout({ children }) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main className="mx-auto max-w-3xl px-4">{children}</main>
      </div>
    );
  }