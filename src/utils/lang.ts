export const getLanguage = () => {
    try {
        const lang = localStorage.getItem('LANGUAGE') || window.navigator.language;
        return lang.split('-')[0].toLowerCase();
    } catch (error) {
        return 'zh';
    }
};

export const setLanguage = (language: string) => {
    const currentLang = getLanguage();
    if (currentLang === language) {
        return;
    }
    localStorage.setItem('LANGUAGE', language);
    window.location.reload();
};
