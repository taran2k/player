import * as React from 'react';
import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';
import { MuteButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * MuteButton
 * -----------------------------------------------------------------------------------------------*/

const MuteButtonBridge = createReactComponent(MuteButtonInstance);

export interface MuteButtonProps extends ReactElementProps<MuteButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for toggling the muted state of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/buttons/mute-button}
 */
const MuteButton = React.forwardRef<HTMLButtonElement, MuteButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <MuteButtonBridge {...(props as Omit<MuteButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button type="button" {...props} ref={composeRefs(props.ref, forwardRef)}>
            {children}
          </Primitive.button>
        )}
      </MuteButtonBridge>
    );
  },
);

MuteButton.displayName = 'MuteButton';
export { MuteButton };
