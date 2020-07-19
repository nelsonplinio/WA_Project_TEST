import React, { useMemo, useState, useCallback } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from 'mdi-react/EditIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import { useCallbackObservable } from 'react-use-observable';

import Alert from 'components/Shared/Alert';
import IOrder from 'interfaces/models/order';
import formatCurrencyValue from 'helpers/formatCurrencyValue';
import { IOption } from 'components/Shared/DropdownMenu';

import orderService from 'services/order';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';

interface IListItemProps {
  order: IOrder;
  onDeleteComplete: () => void;
  handleEdit: (order: IOrder) => void;
}

type IOrderWithTotal = {
  totalFormatted: string;
  valueFormatted: string;
} & IOrder;

const ListItem: React.FC<IListItemProps> = ({ order, handleEdit, onDeleteComplete }) => {
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => {}, []);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o pedido ${order.description}?`)).pipe(
      filter(confirmed => confirmed),
      tap(() => setLoading(true)),
      switchMap(() => orderService.delete(order.id)),
      logError(),
      tap(
        () => {
          Toast.show(`O pedido "${order.description}" foi excluido com sucesso!`);
          setLoading(false);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const orderFormatted = useMemo<IOrderWithTotal>(() => {
    return {
      ...order,
      valueFormatted: formatCurrencyValue(order.value),
      totalFormatted: formatCurrencyValue(order.total)
    };
  }, [order]);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Editar', icon: EditIcon, handler: () => handleEdit(order) },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleEdit, order]);

  if (deleted) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{orderFormatted.description}</TableCell>
      <TableCell>{orderFormatted.quantity}</TableCell>
      <TableCell>{orderFormatted.valueFormatted}</TableCell>
      <TableCell>{orderFormatted.totalFormatted}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
};

export default React.memo(ListItem);
