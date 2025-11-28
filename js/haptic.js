// ============================================
// MODULE: RETOUR HAPTIQUE
// ============================================

const HapticModule = {
    // Vérifier si le retour haptique est disponible
    isAvailable() {
        return 'vibrate' in navigator;
    },

    // Vibration légère (succès)
    light() {
        if (this.isAvailable()) {
            navigator.vibrate(10);
        }
    },

    // Vibration moyenne (action importante)
    medium() {
        if (this.isAvailable()) {
            navigator.vibrate(20);
        }
    },

    // Vibration forte (erreur ou annulation)
    heavy() {
        if (this.isAvailable()) {
            navigator.vibrate(50);
        }
    },

    // Vibration succès (pattern)
    success() {
        if (this.isAvailable()) {
            navigator.vibrate([10, 50, 10]);
        }
    },

    // Vibration erreur (pattern)
    error() {
        if (this.isAvailable()) {
            navigator.vibrate([20, 100, 20, 100, 20]);
        }
    },

    // Vibration pour validation
    confirm() {
        if (this.isAvailable()) {
            navigator.vibrate([15, 30, 15]);
        }
    }
};

// Exposer globalement
window.HapticModule = HapticModule;
