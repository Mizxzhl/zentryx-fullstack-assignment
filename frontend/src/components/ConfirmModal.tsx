type ConfirmModalProps = {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({ message, onCancel, onConfirm }: ConfirmModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
      <h2 className="text-xl font-bold">Confirm deletion</h2>
      <p className="mt-2 text-gray-600">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="w-full rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 sm:w-auto">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 sm:w-auto">
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
