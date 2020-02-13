const onOpen = () => {
    SpreadsheetApp.getUi()
    .createMenu("Custom Script")
    .addItem('About me', 'openAboutSidebar')
    .addToUi();
}

export {
    onOpen
}