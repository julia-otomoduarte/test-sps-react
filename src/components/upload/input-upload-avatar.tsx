import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Icon } from "@iconify/react";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";

import { HOST_API } from "src/config-global";

interface RHFUploadAvatarProps {
  name: string;
  helperText?: string;
}

export function RHFUploadAvatar({ name, helperText }: RHFUploadAvatarProps) {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const previewUrl =
          field.value instanceof File
            ? URL.createObjectURL(field.value)
            : field.value
              ? `${HOST_API}${field.value}`
              : null;

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton
                  size="small"
                  onClick={() => inputRef.current?.click()}
                  sx={{
                    bgcolor: "primary.main",
                    color: "#fff",
                    width: 28,
                    height: 28,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <Icon icon="solar:camera-add-bold" width={16} />
                </IconButton>
              }
            >
              <Avatar
                src={previewUrl ?? undefined}
                sx={{
                  width: 96,
                  height: 96,
                  cursor: "pointer",
                  border: "2px dashed",
                  borderColor: error ? "error.main" : "divider",
                }}
                onClick={() => inputRef.current?.click()}
              >
                {!previewUrl && <Icon icon="solar:user-bold" width={40} />}
              </Avatar>
            </Badge>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) field.onChange(file);
                e.target.value = "";
              }}
            />

            {(!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ textAlign: "center" }}>
                {error ? error.message : helperText}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
}
