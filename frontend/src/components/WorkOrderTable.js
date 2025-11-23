import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function WorkOrderTable({ orders, onEdit, onDelete, onDetail, usuario }) {
  // Si usuario es undefined, el valor por defecto será {}
  usuario = usuario || {};
  const isAdminOrSupervisor = usuario.rol === 'admin' || usuario.rol === 'supervisor';

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell>Responsable</TableCell>
            <TableCell>Inicio</TableCell>
            <TableCell>Cierre</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order._id}>
              <TableCell>{order.title}</TableCell>
              <TableCell>{order.asset ? order.asset.nombre : '-'}</TableCell>
              <TableCell>{order.assignedTo || '-'}</TableCell>
              <TableCell>{order.startDate ? order.startDate.split('T')[0] : '-'}</TableCell>
              <TableCell>{order.endDate ? order.endDate.split('T')[0] : '-'}</TableCell>
              <TableCell>{capitalize(order.status)}</TableCell>
              <TableCell>
                {isAdminOrSupervisor ? (
                  <>
                    <Tooltip title="Editar orden">
                      <Button color="primary" size="small" onClick={() => onEdit(order)} sx={{ p: 0, minWidth: 0, mr: 1 }}>
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar orden">
                      <Button color="error" size="small" onClick={() => onDelete(order)} sx={{ p: 0, minWidth: 0, mr: 1 }}>
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Ver detalle">
                      <Button color="info" size="small" onClick={() => onDetail(order)} sx={{ p: 0, minWidth: 0 }}>
                        <VisibilityIcon />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title="Ver detalle">
                    <Button color="info" size="small" onClick={() => onDetail(order)} sx={{ p: 0, minWidth: 0 }}>
                      <VisibilityIcon />
                    </Button>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WorkOrderTable;
