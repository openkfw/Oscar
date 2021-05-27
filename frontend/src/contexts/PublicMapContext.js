import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const { Consumer, Provider } = React.createContext();

class PublicMapProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isLoading: [] };
  }

  handleIsLoading = (loadingItem, type) => {
    if (type === 'add') {
      this.setState((prevState) => ({ isLoading: [...prevState.isLoading, loadingItem] }));
    } else {
      this.setState((prevState) => {
        const newIsLoading = prevState.isLoading.filter((item) => item.title !== loadingItem);
        return { isLoading: newIsLoading };
      });
    }
  };

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          handleIsLoading: this.handleIsLoading,
        }}>
        {this.props.children}
      </Provider>
    );
  }
}

PublicMapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PublicMapProvider, Consumer as PublicMapConsumer };
