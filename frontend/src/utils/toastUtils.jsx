
import { toast } from 'react-toastify';

export const showSuccessToast = (message) => {
  toast(
    <div className="w-full font-sans overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-green-100 text-green-900 font-bold">
        <span>Successfully!</span>
        <span className="text-sm opacity-70">Just now</span>
      </div>
      <div className="bg-green-600 text-white px-4 py-3 text-sm">
        {message}
      </div>
    </div>,
    { className: '!p-0 !m-0 w-full bg-transparent shadow-none' }
  );
};

export const showErrorToast = (message) => {
  toast(
    <div className="w-full font-sans overflow-hidden rounded-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-red-100 text-red-800 font-bold">
        <span>Failed!</span>
        <span className="text-sm opacity-70">Just now</span>
      </div>
      <div className="bg-red-500 text-white px-4 py-3 text-sm">
        {message}
      </div>
    </div>,
    { className: '!p-0 !m-0 w-full bg-transparent shadow-none' }
  );
};
