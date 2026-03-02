import { useMemo, useEffect, useReducer, useCallback } from "react";

import { loginApi, registerApi } from "src/services/api";

import { setSession, isValidToken } from "./utils";
import { AuthContext } from "./auth-context";
import { AuthUserType, ActionMapType, AuthStateType } from "../../types";

// ----------------------------------------------------------------------

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: { user: AuthUserType };
  [Types.LOGIN]: { user: AuthUserType };
  [Types.REGISTER]: undefined;
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return { loading: false, user: action.payload.user };
  }
  if (action.type === Types.LOGIN) {
    return { ...state, user: action.payload.user };
  }
  if (action.type === Types.REGISTER || action.type === Types.LOGOUT) {
    return { ...state, user: null };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restaura sessão ao carregar a aplicação
  const initialize = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && isValidToken(token) && storedUser) {
      setSession(token);
      dispatch({
        type: Types.INITIAL,
        payload: { user: JSON.parse(storedUser) },
      });
    } else {
      setSession(null);
      dispatch({
        type: Types.INITIAL,
        payload: { user: null },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginApi(email, password);
    const { token, user } = response.data;

    setSession(token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({
      type: Types.LOGIN,
      payload: { user },
    });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, userType?: string) => {
      await registerApi(name, email, password, userType);
      dispatch({ type: Types.REGISTER });
    },
    [],
  );

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
  }, []);

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";
  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
