// Simple keyword-based categorization
export const categorizeTransaction = (description) => {
  const desc = description.toLowerCase();

  const categories = {
    Food: ['restaurant', 'cafe', 'food', 'grocery', 'uber eats', 'doordash', 'starbucks', 'mcdonald', 'pizza', 'burger', 'kitchen', 'dining', 'lunch', 'dinner', 'breakfast'],
    Rent: ['rent', 'landlord', 'housing', 'apartment', 'mortgage'],
    Transport: ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'train', 'bus', 'transit', 'car'],
    Shopping: ['amazon', 'walmart', 'target', 'mall', 'store', 'shop', 'retail', 'clothing', 'fashion'],
    Subscriptions: ['netflix', 'spotify', 'subscription', 'prime', 'hulu', 'disney', 'apple music', 'youtube premium', 'membership'],
    Entertainment: ['movie', 'cinema', 'theater', 'concert', 'game', 'entertainment', 'fun', 'ticket'],
    Healthcare: ['hospital', 'doctor', 'pharmacy', 'medicine', 'health', 'clinic', 'medical', 'dental'],
    Utilities: ['electricity', 'water', 'internet', 'phone', 'utility', 'bill', 'cable', 'wifi', 'mobile']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (desc.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Others';
};