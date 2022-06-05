const constructURI = (...params: string[]) => {
    const baseStr = `${process.env.NEXT_PUBLIC_REST_URI}`

    return [baseStr, ...params].join('/');
};

export default constructURI;