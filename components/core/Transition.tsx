import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import { CSSProperties } from "styled-components";

const DURATION = 200;

const TRANSITIONS: Record<TransitionStatus, CSSProperties> = {
  entering: {
    opacity: 0,
  },
  entered: {
    transition: `opacity ${DURATION}ms`,
    opacity: 1,
  },
  exiting: {
    transition: `opacity ${DURATION}ms`,
    opacity: 0,
  },
  exited: {},
  unmounted: {},
};

const Transition: React.FC<{ location: string }> = ({ children, location }) => {
  return (
    <TransitionGroup>
      <ReactTransition
        key={location}
        timeout={{ enter: DURATION, exit: DURATION }}
      >
        {(status) => <div style={{ ...TRANSITIONS[status] }}>{children}</div>}
      </ReactTransition>
    </TransitionGroup>
  );
};
export default Transition;
