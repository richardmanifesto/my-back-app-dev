import { initialize, mswDecorator } from 'msw-storybook-addon'

import '../stories/00-Base/Sass/main.scss'
import '../stories/global.scss'
import './storybook-style.scss'


// Initialize MSW
initialize()

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

window.isStorybook = true

/**
 * Add custom story parameters.
 *
 * @type {function(*, {parameters: *})}
 */
const additionalStoryParams = ((Story, {parameters}) => {
  const rootStyle = parameters?.rootStyle || ""

  return (
    <div className={`background-${rootStyle}`}>
      <Story/>
    </div>
  );
});

// Provide the MSW addon decorator globally
export const decorators = [
  additionalStoryParams,
  mswDecorator
]