import eventify from 'ngraph.events';

/**
 * Application level event bus. Used to provide decoupled communication between
 * components and state
 */
const bus = eventify({});

export default bus;
