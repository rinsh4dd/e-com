import toast from "react-hot-toast";

export const showConfirmToast = (message, onConfirm) => {
  toast.custom((t) => (
    <div className="bg-white shadow-lg rounded-lg p-4 w-72 border border-gray-200">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Confirm Action</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-sm rounded-md border text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm(); // ✅ Run the actual function
          }}
          className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  ));
};