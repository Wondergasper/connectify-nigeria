
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-connectify-navyBlue dark:text-connectify-blue animate-spin" />
        <p className="mt-4 text-lg font-medium text-connectify-navyBlue dark:text-connectify-blue">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
