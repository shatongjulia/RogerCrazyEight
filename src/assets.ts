export const getCardBackUrl = (cardId: string): string => {
  // Use a hash of the card ID to get a consistent "lock" for LoremFlickr
  // This ensures each card (e.g., "A-hearts") always gets the same unique image
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    hash = cardId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lock = Math.abs(hash) % 500; // Use a range of 500 unique images
  return `https://loremflickr.com/300/450/tropical,plant,leaf/all?lock=${lock}`;
};
