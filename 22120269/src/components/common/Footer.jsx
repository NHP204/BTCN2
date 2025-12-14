export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-950 dark:border-gray-800 mt-auto">
      <div className="max-w-300 mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-blue-600 dark:text-blue-400">
            Movies Info
          </h3>
          <p className="text-sm text-gray-500">Bài tập cá nhân 2</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Thực hiện bởi: Nguyễn Hoài Phú</p>
          <p className="text-sm text-gray-500">MSSV: 22120269</p>
        </div>
      </div>
    </footer>
  );
}
