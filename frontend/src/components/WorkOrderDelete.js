import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';

function WorkOrderDelete({ open, onClose, order, onDelete }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>¿Eliminar orden?</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Confirmas eliminar la orden <strong>{order?.title}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onDelete} color="error" variant="contained">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
export default WorkOrderDelete;
