// Palette de couleurs officielle
export const colors = {
  // Couleurs principales
  'hive-yellow': '#FFAF02',  // Jaune principal
  'hive-pink': '#FF3A82',    // Rose
  'hive-orange': '#F57200',   // Orange
  'hive-purple': '#906CFE',   // Mauve
  'hive-black': '#111111',    // Noir
  'hive-pale': '#FFFDE3',     // Jaune pâle (background)
  'hive-white': '#FFFFFF',    // Blanc

  // États (utilisant la palette officielle)
  'success': '#F57200',       // Orange pour les validations
  'error': '#FF3A82',         // Rose pour les erreurs
  'warning': '#FFAF02',       // Jaune pour les avertissements
  'info': '#906CFE'           // Mauve pour les informations
};

// Exportation des couleurs pour Tailwind
export const tailwindColors = {
  'hive-yellow': colors['hive-yellow'],
  'hive-pink': colors['hive-pink'],
  'hive-orange': colors['hive-orange'],
  'hive-purple': colors['hive-purple'],
  'hive-black': colors['hive-black'],
  'hive-pale': colors['hive-pale'],
  'hive-white': colors['hive-white']
};