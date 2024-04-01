import { Button, RadixDialog, RadixDialogProps } from '~/ui';

export type ConfirmDialogProps = Omit<RadixDialogProps, 'children'> & {
  cancelLabel?: string;
  confirmLabel?: string;
  danger?: boolean;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
};

export const ConfirmDialog = ({
  cancelLabel,
  confirmLabel,
  danger = false,
  message,
  onCancel,
  onConfirm,
  title,
  ...rest
}: ConfirmDialogProps) => {
  return (
    <RadixDialog {...rest}>
      {title && <h2 className="mb-2">{title}</h2>}
      {message && <p>{message}</p>}
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onCancel} variant="outlined">
          {cancelLabel || 'Cancel'}
        </Button>
        <Button color={danger ? 'red' : 'primary'} onClick={onConfirm} variant="raised">
          {confirmLabel || 'Confirm'}
        </Button>
      </div>
    </RadixDialog>
  );
};
