import { useState, useEffect } from "react";

import ModalImage from "react-modal-image";
import api from "../../services/api";

import { styled } from "@mui/material/styles";

const ModalImageStyled = styled(ModalImage)({
  objectFit: "cover",
  width: 250,
  height: 200,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
});

interface ModalImageCorsProps {
  imageUrl: string;
}

const ModalImageCors = ({ imageUrl }: ModalImageCorsProps) => {
  const [fetching, setFetching] = useState(true);
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    if (!imageUrl) return;
    const fetchImage = async () => {
      const { data, headers } = await api.get(imageUrl, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([data], { type: headers["content-type"] })
      );
      setBlobUrl(url);
      setFetching(false);
    };
    fetchImage();
  }, [imageUrl]);

  return (
    <ModalImageStyled
      small={fetching ? imageUrl : blobUrl}
      medium={fetching ? imageUrl : blobUrl}
      large={fetching ? imageUrl : blobUrl}
      alt="image"
    />
  );
};

export default ModalImageCors;
