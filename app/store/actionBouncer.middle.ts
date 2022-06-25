const actionBouncer = (store: any) => (next: any) => (action: any) => {
    console.log(store, next, action)
    debugger
    return next(action)
}

export default actionBouncer;