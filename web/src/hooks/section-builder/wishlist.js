import { useMutation } from "@apollo/client";
import { useToast } from "@shopify/app-bridge-react";
import { useCallback } from "react";
import { UPDATE_WISHLIST_MUTATION, DELETE_WISHLIST_MUTATION } from "~/queries/section-builder/product.gql";

export const useWishlist = (section) => {
  const toast = useToast();

  const [updateAction, { data:dataUpdate, loading:dataUpdateLoading, error:dataUpdateError }] = useMutation(UPDATE_WISHLIST_MUTATION, {});
  const [deleteAction, { data:dataDelete, loading:dataDeleteLoading, error:dataDeleteError }] = useMutation(DELETE_WISHLIST_MUTATION, {});

  const handleUpdate = useCallback(async () => {
    await updateAction({
      variables: {
        key: section?.url_key
      }
    });
    if (!dataUpdateError) {
      toast.show('Liked');
    } else {
      toast.show('Like fail', { isError: true });
    }
  }, [section?.entity_id]);
  const handleDelete = useCallback(async () => {
    await deleteAction({
      variables: {
        key: section?.url_key
      }
    });
    if (!dataDeleteError) {
      toast.show('Unliked');
    } else {
      toast.show('Unlike fail', { isError: true });
    }
  }, [section?.entity_id]);

  return {
    handleUpdate,
    dataUpdateLoading,
    handleDelete,
    dataDeleteLoading
  };
}