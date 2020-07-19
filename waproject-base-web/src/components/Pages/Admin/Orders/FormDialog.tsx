import React, { useCallback } from 'react';
import * as Yup from 'yup';

import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from 'components/Shared/Fields/Text';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { useFormikObservable } from 'hooks/useFormikObservable';
import { tap } from 'rxjs/operators';

import IOrder from 'interfaces/models/order';
import orderService from 'services/order';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';

interface IFormPros {
  order: IOrder;
  open: boolean;
  onCancel: () => void;
  onComplete: (order: IOrder) => void;
}

const useStyles = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center'
  }
});

const validationSchema = Yup.object().shape({
  description: Yup.string().min(3).max(250).required('Descrição obrigatorio!'),
  value: Yup.number().positive().required('Valor obrigatorio!'),
  quantity: Yup.number().positive().required('Quantidade obrigatorio!')
});

const FormDialog: React.FC<IFormPros> = ({ order, open, onCancel, onComplete }) => {
  const classes = useStyles();

  const formik = useFormikObservable<IOrder>({
    initialValues: {},
    validationSchema,
    onSubmit({ id, quantity, description, value }) {
      return orderService.save({ id, description, value, quantity: Number(quantity) }).pipe(
        tap(order => {
          Toast.show(`Pedido "${order.description} foi salvo com sucesso!`);
          onComplete(order);
        }),
        logError(true)
      );
    }
  });

  const handleOnEnter = useCallback(() => {
    formik.setValues(order || formik.initialValues);
  }, [order, formik]);

  const handleOnExited = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleOnEnter}
      onExited={handleOnExited}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{!!order?.id ? 'Editar' : 'Novo'} Pedido</DialogTitle>

        <DialogContent className={classes.content}>
          <TextField label='Descrição' name='description' formik={formik} />

          <div className={classes.flexContainer}>
            <TextField style={{ flex: 1 }} label='Valor' name='value' formik={formik} mask='money' />

            <TextField style={{ flex: 1, marginLeft: 8 }} label='Quantidade' name='quantity' formik={formik} />
          </div>

          <DialogActions>
            <Button onClick={onCancel}>Cancelar</Button>

            <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
              Salvar
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

const Transition = React.memo(
  React.forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);
export default React.memo(FormDialog);
