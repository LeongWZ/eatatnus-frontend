import { Profile } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";
import fetchImageFromUri from "@/utils/fetchImageFromUri";
import path from "path";
import s3Put from "../s3/s3Put";

type PostData = {
  imageUri: string | null;
  bio: string | null;
};

export default function createUserProfile(userId: number, data: PostData) {
  const auth = getAuth();
  const firebaseUser: FirebaseUser | null = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(
        `https://eatatnus-backend-xchix.ondigitalocean.app/api/users/${userId}/profile`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bio: data.bio,
            ...(data.imageUri && {
              imageFilename: path.basename(data.imageUri ?? ""),
            }),
          }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }
      return result.data as Profile;
    })
    .then(async (profile) => {
      if (data.imageUri) {
        fetchImageFromUri(data.imageUri).then((image) => {
          const url = profile.image?.url;
          if (url) {
            return s3Put(url, image);
          }
        });
      }

      return profile;
    });
}
