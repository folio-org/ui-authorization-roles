import { useIntl } from 'react-intl';
import { columnTranslations } from '../../../../constants/translations';

export const useCheckboxAriaStates = () => {
  const { formatMessage } = useIntl();

  const getCheckBoxAriaLabel = (action, resource) => `${formatMessage(columnTranslations[action])} ${resource}`;

  return { formatMessage, getCheckBoxAriaLabel };
};
