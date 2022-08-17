import Modal from './Modal';

import './DeleteNotification.css';

const DeleteNotification = props => {
  return (
    <Modal onHideModal={props.onHideModal}>
      <div className='container'>
        {
          <span className='question'>
            Вы уверены, что хотите удалить <strong>{props.name}</strong> ?
          </span>
        }
        <div className='buttons'>
          <button className='btn-delete' onClick={props.deleteHandler}>
            Удалить
          </button>
          <button className='btn-cancel' onClick={props.onHideModal}>
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteNotification;
