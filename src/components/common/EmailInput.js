import React from "react";
import {inject, observer} from "mobx-react";

@inject("cartStore")
@observer
class EmailInput extends React.Component {
  render() {
    return (
      <div className="email-entry">
        <input
          value={this.props.cartStore.email}
          type="email"
          required
          onChange={event => this.props.cartStore.UpdateEmail(event.target.value)}
          onKeyPress={event => {
            if(!this.props.onEnterPressed || !event.key || event.key.toLowerCase() !== "enter") {
              return;
            }

            this.props.onEnterPressed(event);
          }}
          className="email-input"
          placeholder="Email"
        />

        <div className="hint">
          Please make sure that you have entered your email address correctly as it will be used to send your order confirmation
        </div>
      </div>
    );
  }
}

export default EmailInput;
