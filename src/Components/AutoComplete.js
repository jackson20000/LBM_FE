// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function AutoComplete({setselectedUser}) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const response = await fetch('http://localhost:4000/api/admin/users/1?limit=10000', { method: 'post', body: { search: '' } });
            //   await sleep(1e3); // For demo purposes.
            const users = await response.json();

            if (active) {
                setOptions((users?.users || []).map((item) => ({ id: item?._id, name: item?.firstName + ' ' + item?.lastName })));
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id="asynchronous-demo"
            style={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            onChange={(event, newValue) => {
                setselectedUser(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Users"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
