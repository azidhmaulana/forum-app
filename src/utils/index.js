import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatWaktuLalu = (dateStr) => {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: id,
  });
};
