import PropTypes from 'prop-types';
import Button from '../Button';
import Dialog from './Dialog';

/*
 * Designed to present yes/no choices to the user.
 */
const Confirm = ({
  title,
  message,
  canCancel = true,
  onConfirm,
  onCancel,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  show = false,
}) => (
  <Dialog
    type="confirm"
    icon="info"
    show={show}
    title={title}
    message={message}
    onBlur={() => onCancel?.()}
    options={[
      canCancel ? (
        <Button
          key="cancel"
          onClick={() => onCancel?.()}
          color="navy-taupe"
          content={cancelLabel}
        />
      ) : null,
      <Button
        key="confirm"
        onClick={onConfirm}
        color="sea-green"
        content={confirmLabel}
      />,
    ]}
  />
);

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  canCancel: PropTypes.bool,
  show: PropTypes.bool,
};

export default Confirm;
