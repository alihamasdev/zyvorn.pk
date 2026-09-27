import { useState, type TransitionStartFunction } from "react";
import { upload, type UploadOptions } from "@imagekit/next";
import { type UpdateMetaOptions } from "@tanstack/react-form";
import { ImagePlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { imageAuth } from "@/lib/auth/image-kit";
import { Button } from "@/components/ui/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemPreview,
	FileUploadItemProgress,
	FileUploadList,
	type OnUploadOptions,
} from "@/components/ui/file-upload";

type ImageUploadProps = Omit<React.ComponentProps<typeof FileUpload>, "onUpload" | "value" | "onValueChange"> & {
	transition: TransitionStartFunction;
	pushValue: (value: string) => void;
	removeValue: (index: number, options?: UpdateMetaOptions) => void;
	uploadOptions?: Omit<UploadOptions, "file" | "publicKey" | "token" | "signature" | "expire" | "fileName" | "onProgress">;
};

export function ImageUpload({ transition, uploadOptions, pushValue, removeValue, maxFiles = 4, className, ...props }: ImageUploadProps) {
	const [files, setFiles] = useState<File[]>([]);

	const handleUpload = (files: File[], { onProgress }: OnUploadOptions) => {
		transition(async () => {
			const uploadPromise = files.map(async (file) => {
				try {
					const authParams = await imageAuth();
					const { filePath } = await upload({
						...authParams,
						...uploadOptions,
						file,
						fileName: Date.now().toString(),
						onProgress: (e) => onProgress(file, (e.loaded / e.total) * 100),
					});
					if (!filePath) throw new Error("Upload failed");
					pushValue(filePath);
				} catch (error) {
					console.error(error);
					toast.error("Something went wrong while uploading file");
					setFiles((prev) => prev.filter((fileId) => fileId !== file));
				}
			});

			await Promise.all(uploadPromise);
		});
	};

	return (
		<FileUpload
			value={files}
			maxFiles={maxFiles}
			onValueChange={setFiles}
			onUpload={handleUpload}
			onFileReject={(_, message) => toast.error(message)}
			{...props}
		>
			{!files.length ? (
				<FileUploadDropzone className="min-h-50">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
						<ImagePlusIcon className="size-4" />
					</div>
					<p className="text-sm">Drop your images here or click to upload</p>
				</FileUploadDropzone>
			) : (
				<div className="flex w-full flex-col gap-3 rounded-md py-2">
					<FileUploadList className={className}>
						{files.map((file, index) => (
							<FileUploadItem key={index} value={file} className="rounded-md border-none p-0">
								<FileUploadItemPreview className="size-30">
									<FileUploadItemProgress variant="fill" />
								</FileUploadItemPreview>
								<FileUploadItemDelete asChild>
									<Button size="icon" className="absolute -top-2 -right-2 size-5 rounded-full" onClick={() => removeValue(index)}>
										<XIcon className="size-3" />
									</Button>
								</FileUploadItemDelete>
							</FileUploadItem>
						))}
						{files.length < maxFiles && (
							<FileUploadDropzone>
								<ImagePlusIcon size={18} />
							</FileUploadDropzone>
						)}
					</FileUploadList>
				</div>
			)}
		</FileUpload>
	);
}
