import axios from 'axios'


const getState = ({getStore, getActions, setStore}) => {
    return {

        store: {
			userLogin: "",
			userTokens: "",
            gameData: "",
            favoriteGameInfo: []
        },

        actions: {
            // loadGameData is used in Home Component
            loadGameData: (game_url_to_fetch = "page=1") => {
                const store = getStore()
                setStore({...store,gameData: ""})
                fetch(`https://api.rawg.io/api/games?${game_url_to_fetch}`)
				.then(response => response.json())
				.then(data => {setStore({...store,gameData: data.results})})
				.catch((error) => alert('Something went wrong try again later'))
            },

            // set up a filter to see if the token still valid!
            updateUser: async() => {
                try {
                    const store = getStore()
                    const actions = getActions()
                    const tokens = store.userTokens
                    const header = {Authorization: `Bearer ${tokens.token}`}
                    const requestUserInfo = await axios.get('https://games-api-4geeks.herokuapp.com/user', {headers: header})
                    await setStore({
                        ...store,
                        userLogin: requestUserInfo,
                    })
                    actions.loadFavoriteGameData()
                } catch (error) {
                    alert('Something went wrong please try again later')
                }
            },

            login: async(loginInformation) => {
                try {
                    const tokenRequest = await axios.post('https://games-api-4geeks.herokuapp.com/login', loginInformation)
                    const tokens = tokenRequest.data
                    if (!tokens.token) {return alert(tokens.message)}
                    const header = {Authorization: `Bearer ${tokens.token}`}
                    const requestUserInfo = await axios.get('https://games-api-4geeks.herokuapp.com/user', {headers: header})
                    const store = getStore()
                    setStore({
                        ...store,
                        userLogin: requestUserInfo,
                        userTokens: tokens
                    })
                    return requestUserInfo.data.username
                } catch (error) {
                    alert('Something went wrong please try again later')
                }
            },

            logout: async() => {
                try {
                    const store = await getStore()
                    // console.log(store.userTokens.token)
                    // const header = {Authorization: `Bearer ${store.userTokens.token}`}
                    // await axios.post('https://games-api-4geeks.herokuapp.com/logout', {headers: header})
                    setStore({
                        ...store,
                        userLogin: "",
                        userTokens: ""
                    })
                } catch (error) {
                    alert('Something went wrong please try again later')
                }
            },

            loadFavoriteGameData: async() => {
                try {
                    const store = await getStore()
                    if (store.userLogin) {
                        const favoriteGameRequestData = []
                        const arrOfFavoriteGames = store.userLogin.data.favorite_games;
                        for (let game of arrOfFavoriteGames) {
                            const request = await axios.get(`https://api.rawg.io/api/games/${game.game_url_id}`);
                            favoriteGameRequestData.push(request.data)
                        }
                        setStore({
                            ...store,
                            favoriteGameInfo: favoriteGameRequestData
                        })
                    }
                } catch (error) {
                    alert("Something went wrong please try again later");
                }
            }
        }
    }
};

export default getState;
