import React from "react";

const ErrorHandler = Component => {
  class ErrorHandlerComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        error: undefined,
        errorMessage: undefined,
        componentVersion: 1
      };
    }

    async componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    componentDidCatch(error) {
      if(this.mounted) {
        // eslint-disable-next-line no-console
        console.error(error);

        this.setState({
          error,
          errorMessage: typeof error === "string" ? error : error.message || error.errorMessage
        });
      }
    }

    render() {
      if(this.state.error) {
        return (
          <div className="error-handler">
            <div className="error-handler-error">
              <h4>Error: {this.state.errorMessage}</h4>
              <button onClick={() =>
                this.setState({
                  error: undefined,
                  errorMessage: undefined,
                  componentVersion: this.state.componentVersion + 1
                })}
              >
                Reload
              </button>
            </div>
          </div>
        );
      }

      return this.props.children;
    }
  }

  return props => (
    <ErrorHandlerComponent>
      <Component {...props} />
    </ErrorHandlerComponent>
  );
};


export default ErrorHandler;
