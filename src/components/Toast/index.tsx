import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export interface State {
  readonly open: boolean;
  readonly message: string | null;
};

export interface Props {
  readonly open: boolean;
  readonly message: string | null;
};

let component: Toast;

export function showMessage(msg: string) {
  component.showMsg(msg);
}

class Toast extends React.Component<{}, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
      message: null
    };
  }
  
  componentDidMount() {
    component = this;
  }

  handleClose = (event: React.SyntheticEvent, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  showMsg = (message: string) => {
    this.setState({
      open: true,
      message
    });
  }

  render() {
    const { open, message } = this.state;
    return (
      <Snackbar
        key={message || ''}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        message={message}
      />
    );
  }
};

export default Toast;