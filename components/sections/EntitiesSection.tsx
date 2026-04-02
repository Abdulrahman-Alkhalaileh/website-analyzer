"use client";

import { Chip, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { EntityRow } from "@/helpers/audit";

export interface EntitiesSectionProps {
  entities: EntityRow[];
  embedded?: boolean;
}

export function EntitiesSection({ entities, embedded }: EntitiesSectionProps) {
  if (entities.length === 0) return null;

  const inner = (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        First-party entities are your own origins; everything else is treated as
        third party for attribution in this report.
      </Typography>
      <Stack gap={1.5}>
        {entities.map((e, index) => (
          <Stack
            key={`${e.name}-${index}`}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.03 * index }}
            gap={0.5}
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              borderLeftWidth: 4,
              borderLeftColor: e.isFirstParty ? "primary.main" : "text.secondary",
              bgcolor: e.isFirstParty ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.02)",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="body2" fontWeight={700}>
                {e.name}
              </Typography>
              <Chip
                size="small"
                label={e.isFirstParty ? "First party" : "Third party"}
                color={e.isFirstParty ? "primary" : "default"}
                variant="outlined"
              />
            </Stack>
            {e.origins.length > 0 ? (
              <Typography variant="caption" color="text.secondary">
                {e.origins.join(" · ")}
              </Typography>
            ) : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );

  if (embedded) return inner;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: "divider" }}
    >
      {inner}
    </Paper>
  );
}
