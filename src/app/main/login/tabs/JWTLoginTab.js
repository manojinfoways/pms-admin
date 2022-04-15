import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { submitLogin } from 'app/auth/store/loginSlice';
import * as yup from 'yup';
import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().required('You must enter a email/username'),
	password: yup.string().required('Please enter your password.')
	// .min(3, 'Password is too short - should be 3 chars minimum.')
});

const defaultValues = {
	email: '',
	password: ''
};

function JWTLoginTab(props) {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const { control, setValue, getValues, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const [showPassword, setShowPassword] = useState(false);
	const [errorLogin, setErrorLogin] = useState('');

	useEffect(() => {
		setErrorLogin('');
		setValue('email', '', { shouldDirty: true, shouldValidate: true });
		setValue('password', '', { shouldDirty: true, shouldValidate: true });
	}, [reset, setValue, trigger]);

	useEffect(() => {
		console.log('Login info', login);
		setErrorLogin('');

		if (login.errors && login.errors.length) {
			login.errors.forEach(error => {
				setError(error.type, {
					type: 'manual',
					message: error.message
				});
			});
		} else {
			setErrorLogin(login.errors && login.errors.message ? login.errors.message : '');
			setTimeout(() => {
				setErrorLogin('');
			}, 8000);
		}
	}, [login.errors, setError]);

	function onSubmit(model) {
		dispatch(submitLogin(model));
	}

	return (
		<div className="w-full">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							type="text"
							error={getValues('email') ? !!errors.email : ''}
							helperText={getValues('email') ? errors?.email?.message : ''}
							onKeyUp={e => {
								setValue('email', e.target.value, { shouldDirty: true, shouldValidate: true });
								setErrorLogin('');
							}}
							label="Email"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Icon className="text-20" color="action">
											email
										</Icon>
									</InputAdornment>
								)
							}}
							variant="outlined"
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							label="Password"
							type="password"
							onKeyUp={e => {
								setValue('password', e.target.value, { shouldDirty: true, shouldValidate: true });
								setErrorLogin('');
							}}
							error={getValues('password') ? !!errors.password : ''}
							helperText={getValues('password') ? errors?.password?.message : ''}
							variant="outlined"
							InputProps={{
								className: 'pr-2',
								type: showPassword ? 'text' : 'password',
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)}>
											<Icon className="text-20" color="action">
												{showPassword ? 'visibility' : 'visibility_off'}
											</Icon>
										</IconButton>
									</InputAdornment>
								)
							}}
							required
						/>
					)}
				/>
				<p className="text-red-800">{errorLogin}</p>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16"
					aria-label="LOG IN"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					value="legacy"
				>
					Login
				</Button>
			</form>
		</div>
	);
}

export default JWTLoginTab;
