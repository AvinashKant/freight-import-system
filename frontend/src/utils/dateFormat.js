export const FormatDate = (dateString) =>{
const date = new Date(dateString);
const formatted = date.toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC'
  });
  return formatted
}
