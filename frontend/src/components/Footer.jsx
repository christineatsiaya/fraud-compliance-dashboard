const githubUrl = "https://github.com/christineatsiaya/fraud-compliance-dashboard";

function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="container mx-auto flex flex-col gap-2 px-6 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Built by Christine Atsiaya | Portfolio Project</p>
        <a
          href={githubUrl}
          className="font-medium text-blue-700 hover:text-blue-900 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}

export default Footer;
