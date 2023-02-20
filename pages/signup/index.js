import { useRef, useState, useEffect } from 'react';
import style from "./signup.module.css";
import axios from 'axios'
import {User, useSetUser} from "../../contexts/AppContext";
import {useAddress, useWeb3} from "../../blockchain/BlockchainContext";

export default function SignUp() {
    const [error, setError] = useState('');
    const username = useRef();
    const email = useRef();
    const setUser = useSetUser()
    const address = useAddress()

    useEffect(() => {
        setError('');
    }, [username, email]);

    const cosasParaSignup  = async (username, email) => {
        let user={'name':username,
        'email':email,           
        'address':address ,      
        'isAdmin':true    
        }
        console.log(address)
        
        await axios.post('/api/usercreate', user)
        let body={'address':address}
        const is_registered = await axios.post('/api/getuser',body)
        setUser(new User(is_registered.data[0].id,is_registered.data[0].name , is_registered.data[0].email, address, is_registered.data[0].isAdmin))
        router.push("/home")
    }

    const handleSignup = (e) => {
        
        e.preventDefault();
        if (username.current.value === '' && email.current.value === '') {
            setError('Los campos no pueden ser vacios');
        } else {
            cosasParaSignup(username.current.value, email.current.value)
        }
    }

    return (
        <div className={style.container}>
            <div className={style.signupContainer}>
                <h1 className={style.brandTitle}>IxaTesis</h1>
                <h2 className={style.signupTitle}>Crear cuenta</h2>
                <form onSubmit={handleSignup}>
                    <label className={style.signupInputTitle}>
                        Nombre de usuario
                    </label>
                    <input className={style.signupInput} ref={username} type="username" id="username" />
                    <label className={style.signupInputTitle}>
                        Email
                    </label>
                    <input className={style.signupInput} ref={email} type="email" id="email" />
                    <button className={style.buttonSignup} type="submit">
                        Crear cuenta
                    </button>
                </form>
            </div>
            {error && <p>{error}</p>}
        </ div>
    )
}
