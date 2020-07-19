import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import RefreshIcon from 'mdi-react/RefreshIcon';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TableWrapper from 'components/Shared/TableWrapper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import orderService from 'services/order';
import usePaginationObservable from 'hooks/usePagination';

import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import SearchField from 'components/Shared/Pagination/SearchField';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';

import ListItem from './ListItem';
import FormDialog from '../FormDialog';
import IOrder from 'interfaces/models/order';

const OrderList: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>(null);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => orderService.list(params),
    { orderBy: 'description', orderDirection: 'asc' },
    []
  );

  const handleCreateNewOrder = useCallback(() => {
    setSelectedOrder(null);
    setFormOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const onDeleteComplete = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleEdit = useCallback((order: IOrder) => {
    setSelectedOrder(order);
    setFormOpen(true);
  }, []);

  const onFormComplete = useCallback(
    (order: IOrder) => {
      setFormOpen(false);

      if (!selectedOrder) {
        mergeParams({ ...params, term: String(order.id) });
      } else {
        refresh();
      }
    },
    [params, mergeParams, selectedOrder, refresh]
  );

  const onFormCancel = useCallback(() => {
    setFormOpen(false);
    setSelectedOrder(null);
  }, []);

  return (
    <>
      <Toolbar title='Pedidos' />

      <Card>
        <FormDialog open={formOpen} order={selectedOrder} onComplete={onFormComplete} onCancel={onFormCancel} />

        <CardLoader show={loading} />

        <CardContent>
          <Grid container spacing={2} justify='space-between' alignItems='center'>
            <Grid item xs={12} sm={6} lg={4}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreateNewOrder}>
                Adicionar
              </Button>
            </Grid>
          </Grid>

          <TableWrapper minWidth={500}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellSortable
                    column='description'
                    disabled={loading}
                    onChange={mergeParams}
                    paginationParams={params}
                  >
                    Descrição
                  </TableCellSortable>

                  <TableCellSortable
                    column='quantity'
                    disabled={loading}
                    onChange={mergeParams}
                    paginationParams={params}
                  >
                    Quantidade
                  </TableCellSortable>

                  <TableCellSortable column='value' disabled={loading} onChange={mergeParams} paginationParams={params}>
                    Valor
                  </TableCellSortable>

                  <TableCell>Total</TableCell>

                  <TableCellActions>
                    <IconButton disabled={loading} onClick={handleRefresh}>
                      <RefreshIcon />
                    </IconButton>
                  </TableCellActions>
                </TableRow>
              </TableHead>

              <TableBody>
                <EmptyAndErrorMessages
                  colSpan={6}
                  error={error}
                  loading={loading}
                  onTryAgain={refresh}
                  hasData={data?.results.length > 0}
                />

                {data?.results.map(order => (
                  <ListItem key={order.id} order={order} handleEdit={handleEdit} onDeleteComplete={onDeleteComplete} />
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          <TablePagination
            total={data?.total || 0}
            disabled={loading}
            paginationParams={params}
            onChange={mergeParams}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default React.memo(OrderList);
