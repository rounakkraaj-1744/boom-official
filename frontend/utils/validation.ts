export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) 
    return {
        isValid: false,
        message: "Password must be at least 6 characters long"
    };
  return {
    isValid: true
  };
}

export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (username.length < 3) 
    return {
        isValid: false,
        message: "Username must be at least 3 characters long"
    };
  
  if (username.length > 30) 
    return {
        isValid: false,
        message: "Username must be less than 30 characters"
    };
  
  if (!usernameRegex.test(username)) 
    return {
        isValid: false,
        message: "Username can only contain letters, numbers, and underscores"
    };
  
  return {
    isValid: true
  };
}

export const validateVideoTitle = (title: string): { isValid: boolean; message?: string } => {
  if (title.length < 3) 
    return {
        isValid: false,
        message: "Title must be at least 3 characters long"
    };
  
  if (title.length > 100) 
    return {
        isValid: false,
        message: "Title must be less than 100 characters"
    };
  
  return {
    isValid: true
  };
}

export const validateVideoDescription = (description: string): { isValid: boolean; message?: string } => {
  if (description.length < 10)
    return {
        isValid: false,
        message: "Description must be at least 10 characters long"
    };

  if (description.length > 500)
    return {
        isValid: false,
        message: "Description must be less than 500 characters"
    };

  return {
    isValid: true
  };
}