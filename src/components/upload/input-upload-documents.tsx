import { useRef } from "react";
import { Icon } from "@iconify/react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

interface UploadDocumentProps {
  file?: File;
  existingUrl?: string;
  onChange: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  error?: string;
}

export function UploadDocument({
  file,
  existingUrl,
  onChange,
  onRemove,
  accept,
  error,
}: UploadDocumentProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: error ? "error.main" : "divider",
        borderRadius: 1,
      }}
    >
      <ListItem
        secondaryAction={
          <IconButton size="small" color="error" edge="end" onClick={onRemove}>
            <Icon icon="solar:trash-bin-trash-bold" width={16} />
          </IconButton>
        }
      >
        <ListItemIcon
          sx={{ minWidth: 32, cursor: "pointer" }}
          onClick={() => inputRef.current?.click()}
        >
          <Icon
            icon={
              file || existingUrl ? "solar:file-text-bold" : "solar:upload-bold"
            }
            width={18}
          />
        </ListItemIcon>

        <ListItemText
          onClick={() => inputRef.current?.click()}
          sx={{ cursor: "pointer" }}
          primary={
            <Typography
              variant="body2"
              noWrap
              color={file || existingUrl ? "text.primary" : "text.disabled"}
            >
              {file
                ? file.name
                : existingUrl
                  ? existingUrl.split("/").pop()
                  : "Clique para selecionar"}
            </Typography>
          }
        />
      </ListItem>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
          e.target.value = "";
        }}
      />
    </Box>
  );
}
