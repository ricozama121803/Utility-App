import { Box, Typography, Paper } from '@mui/material';
import { getTokens } from '../utils/token-storage';

export const TokenDisplay = () => {
  const tokens = getTokens();

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Stored Tokens</Typography>
      <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        <Typography variant="body2" color="primary">
          {tokens ? JSON.stringify(tokens, null, 2) : 'No tokens stored'}
        </Typography>
      </Box>
    </Paper>
  );
};
